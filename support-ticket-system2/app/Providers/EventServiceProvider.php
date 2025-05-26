<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use App\Events\TicketCreated;
use App\Events\TicketReplied;
use App\Listeners\SendTicketCreatedEmailListener;
use App\Listeners\SendTicketReplyEmailListener;
class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        TicketCreated::class => [
            SendTicketCreatedEmailListener::class,
        ],
        TicketReplied::class => [
            SendTicketReplyEmailListener::class,
        ],
    ];
    
    public function boot()
    {
        //
    }
}
