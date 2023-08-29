import {
  Sidenav,
  Dropdown,
  Ripple,
  Input,
  Select,
  initTE
} from "tw-elements";
initTE({ Sidenav, Dropdown, Ripple, Input, Select });
import Swal from 'sweetalert2'
import axios from "axios";
import { addConfirmDelete } from './alerts';
//seguridad para formularios
axios.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
window.axios = axios;
window.Swal = Swal;
window.Select = Select;
const sidenav2 = document.getElementById("sidenav-1");
const sidenavInstance2 = Sidenav.getInstance(sidenav2);

document.addEventListener('DOMContentLoaded', function () {
  addConfirmDelete();
});

let innerWidth2 = null;
const setMode2 = (e) => {
  // Check necessary for Android devices
  if (window.innerWidth === innerWidth2) {
    return;
  }

  innerWidth2 = window.innerWidth;

  if (window.innerWidth < sidenavInstance2.getBreakpoint("xl")) {
    sidenavInstance2.changeMode("over");
    sidenavInstance2.hide();
  } else {
    sidenavInstance2.changeMode("side");
    sidenavInstance2.show();
  }
};

if (window.innerWidth < sidenavInstance2.getBreakpoint("sm")) {
  setMode2();
}

// Event listeners
window.addEventListener("resize", setMode2);