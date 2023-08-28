export function addConfirmDelete() {
    var formsConfirm = document.querySelectorAll('.form-confirms');
    if (formsConfirm.length > 0) {
        formsConfirm.forEach(formElement => {
            const mensaje = formElement.getAttribute('data-message');
            console.log(mensaje);
            formElement.addEventListener('submit', function (e) {
                e.preventDefault();
                Swal.fire({
                    title: "Estas seguro de eliminar?",
                    text: '',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Sí, eliminar',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        formElement.submit();
                    }
                });
            });
        });
    }
}