import Swal from 'sweetalert2'
import axios from "axios";
import VanillaMasker from 'vanilla-masker';
import { addConfirmDelete } from './alerts';
//seguridad para formularios
window.axios = axios;
window.Swal = Swal;

document.addEventListener('DOMContentLoaded', function () {
  addConfirmDelete();
});
document.addEventListener("DOMContentLoaded", function() {
  VanillaMasker(document.querySelectorAll(".phone-mask")).maskPattern("(999) 999-9999");
});


document.querySelector('[data-dropdown-toggle]').addEventListener("click", function(e){
  e.preventDefault();
  var submenu = document.getElementById("dropdown-user");
  if(submenu){
    submenu.classList.toggle("hidden");
  }
});

document.getElementById("btnLogout").addEventListener("click", function(e){
  e.preventDefault();
  
});