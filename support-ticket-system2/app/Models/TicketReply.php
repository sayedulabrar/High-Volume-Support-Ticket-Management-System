<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TicketReply extends Model
{
    use HasFactory;

    protected $fillable = [
        'ticket_id',
        'user_id',
        'message',
    ];

    // The ticket this reply belongs to
    public function ticket()
    {
        return $this->belongsTo(Ticket::class);
    }

    // The user (customer or agent) who made the reply
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
