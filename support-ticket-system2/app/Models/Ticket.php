<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'assigned_to',
        'subject',
        'category',
        'priority',
        'description',
        'status',
    ];

    // Customer who created the ticket
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Assigned support agent
    public function assignedAgent()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    // Replies to the ticket
    public function replies()
    {
        return $this->hasMany(TicketReply::class);
    }
}
