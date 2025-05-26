<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Events\TicketCreated;
use App\Mail\TicketCreatedMail;
use Illuminate\Support\Facades\Mail;

class TicketController extends Controller
{
    // List tickets based on role
    public function index(Request $request)
    {
        $user = Auth::user();
    
        $query = Ticket::with(['user', 'assignedAgent']);
    
        // Role-based access
        if ($user->hasRole('Admin')) {
            // No additional constraints
        } elseif ($user->hasRole('Support Agent')) {
            $query->where('assigned_to', $user->id);
        } else { // Customer
            $query->where('user_id', $user->id);
        }
    
        // Apply filters if present
        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }
    
        if ($request->filled('priority')) {
            $query->where('priority', $request->priority);
        }
    
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
    
        // Allow filtering by assigned_to only for Admins
        if ($request->filled('assigned_to') && $user->hasRole('Admin')) {
            $query->where('assigned_to', $request->assigned_to);
        }
    
        $tickets = $query->get();
    
        if ($tickets->isEmpty()) {
            return response()->json(['message' => 'No tickets found'], 200);
        }
    
        return response()->json(['tickets' => $tickets], 200);
    }
    
    // Create a new ticket
    public function store(Request $request)
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'priority' => 'required|in:low,medium,high',
            'description' => 'required|string',
        ]);

        $ticket = Ticket::create([
            'user_id' => Auth::id(),
            'subject' => $validated['subject'],
            'category' => $validated['category'],
            'priority' => $validated['priority'],
            'description' => $validated['description'],
            'status' => 'open',
        ]);

        $ticket->load('user', 'assignedAgent');

        event(new TicketCreated($ticket));

        // Optional: Send confirmation email
        try {
            $user = Auth::user();
            Mail::to($user->email)->send(new TicketCreatedMail($ticket));
        } catch (\Exception $e) {
            \Log::error('Mail sending failed: '.$e->getMessage());
            return response()->json([
                'message' => 'Ticket created but failed to send email',
                'error' => $e->getMessage(),
                'ticket' => $ticket
            ], 201);
        }

        return response()->json([
            'message' => 'Ticket created and confirmation email sent',
            'ticket' => $ticket
        ], 201);
    }

    // View specific ticket
    public function show($id)
    {
        $ticket = Ticket::with(['user', 'assignedAgent'])->findOrFail($id);
        $user = Auth::user();

        if (
            ($user->hasRole('Customer') && $ticket->user_id !== $user->id) ||
            ($user->hasRole('Support Agent') && $ticket->assigned_to !== $user->id)
        ) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        return response()->json(['ticket' => $ticket], 200);
    }

    // Update ticket status
    public function updateStatus(Request $request, $id)
    {
        $request->validate(['status' => 'required|in:open,in progress,resolved,closed']);
        $ticket = Ticket::findOrFail($id);
        $user = Auth::user();

        if ($user->hasRole('Support Agent') && $ticket->assigned_to !== $user->id) {
            return response()->json(['error' => 'Unauthorized: You are not assigned to this ticket.'], 403);
        }

        $ticket->status = $request->status;
        $ticket->save();

        return response()->json(['message' => 'Status updated'], 200);
    }

    // Assign ticket to support agent
    public function assign(Request $request, $id)
    {
        $request->validate(['assigned_to' => 'required|exists:users,id']);

        $agent = User::findOrFail($request->assigned_to);

        if (!$agent->hasRole('Support Agent')) {
            return response()->json(['error' => 'User must have the Support Agent role to be assigned'], 400);
        }

        $ticket = Ticket::findOrFail($id);
        $ticket->assigned_to = $agent->id;
        $ticket->save();

        return response()->json(['message' => 'Ticket assigned to Support Agent'], 200);
    }

}
