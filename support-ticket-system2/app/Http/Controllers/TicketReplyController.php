<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\TicketReply;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Events\TicketReplied;

class TicketReplyController extends Controller
{
    // ✅ View replies for a ticket
    public function index($ticketId)
    {
        $ticket = Ticket::findOrFail($ticketId);
        $user = Auth::user();

        // Allow customer only if they own the ticket
        if ($user->hasRole('Customer') && $ticket->user_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Allow support agent only if assigned to the ticket
        if ($user->hasRole('Support Agent') && $ticket->assigned_to !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Admins are not allowed to view replies
        if (!$user->hasRole('Customer') && !$user->hasRole('Support Agent')) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $replies = $ticket->replies()->with('user')->get();

        return response()->json(['replies'=> $replies], 200);
    }

    // ✅ Post a reply to a ticket
    public function store(Request $request, $ticketId)
    {
        $request->validate([
            'message' => 'required|string',
        ]);

        $ticket = Ticket::findOrFail($ticketId);
        $user = Auth::user();

        // Allow only customers and agents
        if (!$user->hasRole('Customer') && !$user->hasRole('Support Agent')) {
            return response()->json(['error' => 'Only Customers and Support Agents can reply'], 403);
        }

        // Customer can reply only to their own tickets
        if ($user->hasRole('Customer') && $ticket->user_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Agent can reply only if assigned
        if ($user->hasRole('Support Agent') && $ticket->assigned_to !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $reply = TicketReply::create([
            'ticket_id' => $ticket->id,
            'user_id' => $user->id,
            'message' => $request->message,
        ]);

        $reply = TicketReply::with('ticket.assignedAgent', 'ticket.user')->find($reply->id);

        event(new TicketReplied($reply, auth()->id()));

        return response()->json([
            'message' => 'Reply added',
            'reply' => $reply
        ], 201); // 201 Created
    }
}
