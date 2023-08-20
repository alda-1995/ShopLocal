@props(['type' => 'button', 'label' => ''])
<button
  type="{{ $type }}"
  data-te-ripple-init
  class="btn btn-primary">
  {{ $label }}
</button>