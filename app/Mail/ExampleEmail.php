<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ExampleEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $subject;
    public $content;
    public $sender;

     public function __construct($content, $subject, $sender)
    {
        $this->subject = $subject;
        $this->content = $content;
        $this->sender = $sender;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->subject,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'email.emailTemplate',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
