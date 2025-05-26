@component('mail::message')
# Ticket Reminder

Dear {{ $user->name }},

This is a reminder that the ticket titled "**{{ $ticket->subject }}**" has been pending for over 3 days.

Current Status: **{{ ucfirst($ticket->status) }}**

Please take the necessary action.

@component('mail::button', ['url' => url("/customer/tickets/{$ticket->id}")])
View Ticket
@endcomponent

Thanks,<br>
Support Team
@endcomponent
