/**
 * VINTCAM — Form Validation Utilities
 */
function validateField(inputElement, validationRules) {
  const value = inputElement.value.trim();
  let isValid = true;
  let errorMessage = "";

  if (validationRules.required && !value) {
    isValid = false;
    errorMessage = "This field cannot be left blank.";
  } else if (validationRules.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    isValid = false;
    errorMessage = "Please enter a valid email address.";
  }

  showValidationError(inputElement, isValid, errorMessage);
  return isValid;
}

function showValidationError(input, isValid, message) {
  // Check if error tracking message container already exists
  let errorBadge = input.parentNode.querySelector('.form-error-msg');
  
  if (!isValid) {
    input.classList.add('border-red-500', 'focus:ring-red-500');
    if (!errorBadge) {
      errorBadge = document.createElement('span');
      errorBadge.className = 'form-error-msg text-xs text-red-500 mt-1 block font-ui';
      input.parentNode.appendChild(errorBadge);
    }
    errorBadge.textContent = message;
  } else {
    input.classList.remove('border-red-500', 'focus:ring-red-500');
    if (errorBadge) errorBadge.remove();
  }
}