function addPasswordConfirmation(passwordInputId, confirmPasswordInputId) {
  const passwordInput = document?.getElementById(passwordInputId);
  const confirmPasswordInput = document?.getElementById(confirmPasswordInputId);

  confirmPasswordInput?.addEventListener("input", () => {
    if (confirmPasswordInput.value !== passwordInput.value) {
      confirmPasswordInput.setCustomValidity("Пароли не совпадают");
      confirmPasswordInput.classList.add("invalid");
    } else {
      confirmPasswordInput.setCustomValidity("");
      confirmPasswordInput.classList.remove("invalid");
    }
  });
}
addPasswordConfirmation("password", "password-confirm");
