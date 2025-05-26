<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use App\Mail\TicketReplyMail;
use App\Models\Ticket;
use App\Models\TicketReply;

class SendTicketReplyEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $reply;
    public $currentUserId;

    public function __construct(TicketReply $reply, $currentUserId = null)
    {
        $this->reply = $reply;
        $this->currentUserId = $currentUserId;
    }


    public function handle()
    {
        $ticket = $this->reply->ticket;

        // Determine recipient: if current user is ticket creator, recipient is assigned agent email
        // Otherwise, recipient is ticket creator email
        if ($this->currentUserId === $ticket->user_id) {
            $recipientEmail = optional($ticket->assignedAgent)->email;  // Make sure to use assignedAgent relation here
        } else {
            $recipientEmail = $ticket->user->email;
        }

        if ($recipientEmail) {
            Mail::to($recipientEmail)->queue(new TicketReplyMail($ticket,$this->reply));
        }
    }

}

