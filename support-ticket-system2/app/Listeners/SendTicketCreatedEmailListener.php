<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Events\TicketCreated;
use App\Jobs\SendTicketCreatedEmail;
class SendTicketCreatedEmailListener
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
    public function handle(TicketCreated $event)
    {
        SendTicketCreatedEmail::dispatch($event->ticket);
    }
}
