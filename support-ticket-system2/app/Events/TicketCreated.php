<?php
namespace App\Events;

use App\Models\Ticket;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TicketCreated
{
    use Dispatchable, SerializesModels;

    public $ticket;

    /**
     * Create a new event instance.
     */
    public function __construct(Ticket $ticket)
    {
        $this->ticket= $ticket;
    }

    /**
     * Get the channels the event should broadcast on (optional).
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('channel-name'), // You can remove this if not using broadcasting
        ];
    }
}
