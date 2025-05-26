<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use App\Mail\TicketCreatedMail;
use App\Models\Ticket;
use Illuminate\Support\Facades\Log;
use App\Models\User;

class SendTicketCreatedEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $ticket;

    public function __construct( Ticket $ticket)
    {
        $this->ticket = $ticket;
    }

    public function handle()
    {
        Log::info('Sending ticket created email to customer:', [
            'email' => $this->ticket->user->email,
            'ticket_id' => $this->ticket->id,
            'subject' => $this->ticket->subject,
        ]);

        // Email the customer
        Mail::to($this->ticket->user->email)
            ->queue(new TicketCreatedMail($this->ticket));

        // Email all users with "Support Agent" role
        $supportAgents = User::role('Support Agent')->get();

        foreach ($supportAgents as $agent) {
            Mail::to($agent->email)
                ->queue(new TicketCreatedMail($this->ticket));
        }
    }
}


