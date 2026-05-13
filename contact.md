---
layout: page
title: Suggest a Place
permalink: /contact/
---

# Suggest a Place

Know a café with the perfect background hum? A library where time slows down? A train platform with a particular kind of quiet?

If you have a real-world recording you'd like to see added to Travelier — or just want to point me toward one — I'd love to hear from you. Fill in the form below and I'll get back to you as soon as I can.

<form class="contact-form" action="https://api.web3forms.com/submit" method="POST">
  <input type="hidden" name="access_key" value="40330526-a208-4cd5-9950-92839cddc56c">
  <input type="hidden" name="subject" value="New Place suggestion — Travelier">
  <input type="checkbox" name="botcheck" style="display:none">

  <div class="contact-form__field">
    <label for="cf-name">Your name</label>
    <input type="text" id="cf-name" name="name" required autocomplete="name" placeholder="Ignacio">
  </div>

  <div class="contact-form__field">
    <label for="cf-email">Your email</label>
    <input type="email" id="cf-email" name="email" required autocomplete="email" placeholder="you@example.com">
  </div>

  <div class="contact-form__field">
    <label for="cf-place">Place name</label>
    <input type="text" id="cf-place" name="place_name" placeholder="e.g. Café de Flore, Paris">
  </div>

  <div class="contact-form__field">
    <label for="cf-link">Link to recording <span class="contact-form__optional">(optional)</span></label>
    <input type="url" id="cf-link" name="recording_link" placeholder="https://freesound.org/...">
  </div>

  <div class="contact-form__field">
    <label for="cf-message">Anything else</label>
    <textarea id="cf-message" name="message" rows="4" placeholder="Tell me about this place…"></textarea>
  </div>

  <button type="submit" class="btn contact-form__submit">Send</button>
</form>
