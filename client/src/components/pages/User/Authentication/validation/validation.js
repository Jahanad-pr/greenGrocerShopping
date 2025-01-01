// Bismillah

export const validateFormData = (formData, mission) => {
    const errors = {};
  
    // Username validation
    if (mission) {
      if (!formData.username) {
        errors.username = "Username is required.";
      } else if (formData.username.length < 5) {
        errors.username = "Username must be at least 5 characters long.";
      } else if (!/^[A-Z]/.test(formData.username)) {
        errors.username = "Username must start with a capital letter.";
      }
    }
  
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      errors.email = "Email is required.";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Enter a valid email address.";
    }
  
    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=<>?{}~|/]).{8,}$/;
    if (!formData.password) {
      errors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters.";
    } else if (!/[A-Z]/.test(formData.password)) {
      errors.password = "Password must contain at least one uppercase letter.";
    } else if (!/[a-z]/.test(formData.password)) {
      errors.password = "Password must contain at least one lowercase letter.";
    } else if (!/\d/.test(formData.password)) {
      errors.password = "Password must contain at least one number.";
    } else if (!/[!@#$%^&*()_\-+=<>?{}~|/]/.test(formData.password)) {
      errors.password = "Password must contain at least one special symbol.";
    }
  
    // Confirm Password validation
    if (mission) {
      if (!formData.confirmPassword) {
        errors.confirmPassword = "Confirm Password is required.";
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Passwords do not match.";
      }
    }
  
    return errors;
  };
  