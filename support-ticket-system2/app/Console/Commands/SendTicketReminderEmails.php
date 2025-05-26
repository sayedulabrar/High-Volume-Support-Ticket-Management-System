<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Ticket;
use App\Mail\TicketReminderMail;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class SendTicketReminderEmails extends Command
{
    protected $signature = 'tickets:send-reminders';

    protected $description = 'Send reminder emails for tickets pending resolution';

    public function handle()
    {
        $reminderDays = 1; // Customize reminder period

        // Fetch tickets open or in progress for more than $reminderDays days
        $tickets = Ticket::with(['user', 'assignedAgent'])
        ->whereIn('status', ['open', 'in progress'])
        ->where('updated_at', '<=', Carbon::now()->subDays($reminderDays))
        ->get();
    

        foreach ($tickets as $ticket) {
            // Send email to assigned agent if assigned
            if ($ticket->assigned_to) {
                $agent = $ticket->assignedAgent; // Define relationship in Ticket model
                if ($agent && $agent->email) {
                    Mail::to($agent->email)->queue(new TicketReminderMail($ticket, $agent));
                }
            }

            // Send email to customer
            $customer = $ticket->customer; // Define relationship in Ticket model
            if ($customer && $customer->email) {
                Mail::to($customer->email)->queue(new TicketReminderMail($ticket, $customer));
            }
        }

        $this->info('Ticket reminder emails sent successfully.');
    }
}
