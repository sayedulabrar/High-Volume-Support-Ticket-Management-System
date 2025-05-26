<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Events\TicketReplied;
use App\Jobs\SendTicketReplyEmail;

class SendTicketReplyEmailListener
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(TicketReplied $event)
    {
        SendTicketReplyEmail::dispatch($event->reply,$event->currentUserId);
    }
}
