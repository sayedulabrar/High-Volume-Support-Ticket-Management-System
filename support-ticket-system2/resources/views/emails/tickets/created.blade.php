@component('mail::message')
# Ticket Created

Your ticket (ID: {{ $ticket->id }}) has been created.

**Subject:** {{ $ticket->subject }}

We will get back to you soon.

Thanks,<br>
{{ config('app.name') }}
@endcomponent
