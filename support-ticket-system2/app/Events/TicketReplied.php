<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\TicketReply;

class TicketReplied
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    public $reply;
    public $currentUserId;

    /**
     * Create a new event instance.
     */
    public function __construct(TicketReply $reply, $currentUserId)
    {
        $this->reply = $reply;
        $this->currentUserId = $currentUserId;
    }


    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('channel-name'),
        ];
    }
}
