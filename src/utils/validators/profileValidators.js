// src/utils/validators/profileValidators.js
// Profile form and data validators
/**
 * Validation result type
 * @typedef {Object} ValidationResult
 * @property {boolean} isValid - Whether validation passed
 * @property {string} error - Error message if validation failed
 */
/**
 * Validate name
 * @param {string} name - Name to validate
 * @param {object} options - Validation options
 * @returns {ValidationResult}
 */
export const validateName = (name, options = {}) => {
  const {
    minLength = 2,
    maxLength = 100,
    allowNumbers = false,
    required = true,
  } = options;
  if (!name || name.trim() === '') {
    if (required) {
      return {
        isValid: false,
        error: 'Nama wajib diisi',
      };
    }
    return {
      isValid: true,
      error: '',
    };
  }
  const trimmedName = name.trim();
  if (trimmedName.length < minLength) {
    return {
      isValid: false,
      error: `Nama minimal ${minLength} karakter`,
    };
  }
  if (trimmedName.length > maxLength) {
    return {
      isValid: false,
      error: `Nama maksimal ${maxLength} karakter`,
    };
  }
  // Check for valid characters (letters, spaces, and common name characters)
  const nameRegex = allowNumbers
    ? /^[a-zA-Z0-9\s'.,-]+$/
    : /^[a-zA-Z\s'.,-]+$/;
  if (!nameRegex.test(trimmedName)) {
    return {
      isValid: false,
      error: 'Nama hanya boleh berisi huruf dan karakter umum',
    };
  }
  return {
    isValid: true,
    error: '',
  };
};
/**
 * Validate height (in cm)
 * @param {number|string} height - Height value
 * @param {object} options - Validation options
 * @returns {ValidationResult}
 */
export const validateHeight = (height, options = {}) => {
  const {
    minHeight = 50, // cm
    maxHeight = 250, // cm
    required = false,
  } = options;
  if (height === null || height === undefined || height === '') {
    if (required) {
      return {
        isValid: false,
        error: 'Tinggi badan wajib diisi',
      };
    }
    return {
      isValid: true,
      error: '',
    };
  }
  const numHeight = parseFloat(height);
  if (isNaN(numHeight)) {
    return {
      isValid: false,
      error: 'Tinggi badan harus berupa angka',
    };
  }
  if (numHeight < minHeight) {
    return {
      isValid: false,
      error: `Tinggi badan minimal ${minHeight} cm`,
    };
  }
  if (numHeight > maxHeight) {
    return {
      isValid: false,
      error: `Tinggi badan maksimal ${maxHeight} cm`,
    };
  }
  return {
    isValid: true,
    error: '',
  };
};
/**
 * Validate weight (in kg)
 * @param {number|string} weight - Weight value
 * @param {object} options - Validation options
 * @returns {ValidationResult}
 */
export const validateWeight = (weight, options = {}) => {
  const {
    minWeight = 10, // kg
    maxWeight = 300, // kg
    required = false,
  } = options;
  if (weight === null || weight === undefined || weight === '') {
    if (required) {
      return {
        isValid: false,
        error: 'Berat badan wajib diisi',
      };
    }
    return {
      isValid: true,
      error: '',
    };
  }
  const numWeight = parseFloat(weight);
  if (isNaN(numWeight)) {
    return {
      isValid: false,
      error: 'Berat badan harus berupa angka',
    };
  }
  if (numWeight < minWeight) {
    return {
      isValid: false,
      error: `Berat badan minimal ${minWeight} kg`,
    };
  }
  if (numWeight > maxWeight) {
    return {
      isValid: false,
      error: `Berat badan maksimal ${maxWeight} kg`,
    };
  }
  return {
    isValid: true,
    error: '',
  };
};
/**
 * Validate birth date
 * @param {Date|string} birthDate - Birth date
 * @param {object} options - Validation options
 * @returns {ValidationResult}
 */
export const validateBirthDate = (birthDate, options = {}) => {
  const {
    minAge = 5, // years
    maxAge = 100, // years
    required = false,
  } = options;
  if (!birthDate) {
    if (required) {
      return {
        isValid: false,
        error: 'Tanggal lahir wajib diisi',
      };
    }
    return {
      isValid: true,
      error: '',
    };
  }
  const date = new Date(birthDate);
  if (isNaN(date.getTime())) {
    return {
      isValid: false,
      error: 'Format tanggal lahir tidak valid',
    };
  }
  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
    age--;
  }
  if (age < minAge) {
    return {
      isValid: false,
      error: `Usia minimal ${minAge} tahun`,
    };
  }
  if (age > maxAge) {
    return {
      isValid: false,
      error: `Usia maksimal ${maxAge} tahun`,
    };
  }
  if (date > today) {
    return {
      isValid: false,
      error: 'Tanggal lahir tidak boleh di masa depan',
    };
  }
  return {
    isValid: true,
    error: '',
  };
};
/**
 * Validate gender
 * @param {string} gender - Gender value
 * @param {object} options - Validation options
 * @returns {ValidationResult}
 */
export const validateGender = (gender, options = {}) => {
  const {
    required = false,
    validValues = ['male', 'female', 'laki-laki', 'perempuan'],
  } = options;
  if (!gender || gender.trim() === '') {
    if (required) {
      return {
        isValid: false,
        error: 'Jenis kelamin wajib dipilih',
      };
    }
    return {
      isValid: true,
      error: '',
    };
  }
  if (!validValues.includes(gender.toLowerCase())) {
    return {
      isValid: false,
      error: 'Jenis kelamin tidak valid',
    };
  }
  return {
    isValid: true,
    error: '',
  };
};
/**
 * Validate blood type
 * @param {string} bloodType - Blood type value
 * @param {object} options - Validation options
 * @returns {ValidationResult}
 */
export const validateBloodType = (bloodType, options = {}) => {
  const {
    required = false,
    validTypes = ['A', 'B', 'AB', 'O', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  } = options;
  if (!bloodType || bloodType.trim() === '') {
    if (required) {
      return {
        isValid: false,
        error: 'Golongan darah wajib dipilih',
      };
    }
    return {
      isValid: true,
      error: '',
    };
  }
  if (!validTypes.includes(bloodType.toUpperCase())) {
    return {
      isValid: false,
      error: 'Golongan darah tidak valid',
    };
  }
  return {
    isValid: true,
    error: '',
  };
};
/**
 * Validate address
 * @param {string} address - Address text
 * @param {object} options - Validation options
 * @returns {ValidationResult}
 */
export const validateAddress = (address, options = {}) => {
  const {
    minLength = 10,
    maxLength = 500,
    required = false,
  } = options;
  if (!address || address.trim() === '') {
    if (required) {
      return {
        isValid: false,
        error: 'Alamat wajib diisi',
      };
    }
    return {
      isValid: true,
      error: '',
    };
  }
  const trimmedAddress = address.trim();
  if (trimmedAddress.length < minLength) {
    return {
      isValid: false,
      error: `Alamat minimal ${minLength} karakter`,
    };
  }
  if (trimmedAddress.length > maxLength) {
    return {
      isValid: false,
      error: `Alamat maksimal ${maxLength} karakter`,
    };
  }
  return {
    isValid: true,
    error: '',
  };
};
/**
 * Validate school name
 * @param {string} schoolName - School name
 * @param {object} options - Validation options
 * @returns {ValidationResult}
 */
export const validateSchoolName = (schoolName, options = {}) => {
  const {
    minLength = 3,
    maxLength = 200,
    required = false,
  } = options;
  if (!schoolName || schoolName.trim() === '') {
    if (required) {
      return {
        isValid: false,
        error: 'Nama sekolah wajib diisi',
      };
    }
    return {
      isValid: true,
      error: '',
    };
  }
  const trimmedName = schoolName.trim();
  if (trimmedName.length < minLength) {
    return {
      isValid: false,
      error: `Nama sekolah minimal ${minLength} karakter`,
    };
  }
  if (trimmedName.length > maxLength) {
    return {
      isValid: false,
      error: `Nama sekolah maksimal ${maxLength} karakter`,
    };
  }
  return {
    isValid: true,
    error: '',
  };
};
/**
 * Validate class/grade
 * @param {string} className - Class name
 * @param {object} options - Validation options
 * @returns {ValidationResult}
 */
export const validateClass = (className, options = {}) => {
  const {
    required = false,
    validClasses = ['VII', 'VIII', 'IX', 'X', 'XI', 'XII', '7', '8', '9', '10', '11', '12'],
  } = options;
  if (!className || className.trim() === '') {
    if (required) {
      return {
        isValid: false,
        error: 'Kelas wajib dipilih',
      };
    }
    return {
      isValid: true,
      error: '',
    };
  }
  // Allow any format but validate if validClasses provided
  if (validClasses.length > 0) {
    const upperClass = className.toUpperCase().trim();
    const isValid = validClasses.some(
      (c) => c.toUpperCase() === upperClass || upperClass.includes(c.toUpperCase())
    );
    
    if (!isValid) {
      return {
        isValid: false,
        error: 'Format kelas tidak valid',
      };
    }
  }
  return {
    isValid: true,
    error: '',
  };
};
/**
 * Validate profile form
 * @param {object} formData - Profile form data
 * @returns {object} { isValid, errors }
 */
export const validateProfileForm = (formData) => {
  const errors = {};
  // Validate name
  const nameValidation = validateName(formData.name, { required: true });
  if (!nameValidation.isValid) {
    errors.name = nameValidation.error;
  }
  // Validate height (optional)
  const heightValidation = validateHeight(formData.height);
  if (!heightValidation.isValid) {
    errors.height = heightValidation.error;
  }
  // Validate weight (optional)
  const weightValidation = validateWeight(formData.weight);
  if (!weightValidation.isValid) {
    errors.weight = weightValidation.error;
  }
  // Validate birth date (optional)
  const birthDateValidation = validateBirthDate(formData.birthDate);
  if (!birthDateValidation.isValid) {
    errors.birthDate = birthDateValidation.error;
  }
  // Validate gender (optional)
  const genderValidation = validateGender(formData.gender);
  if (!genderValidation.isValid) {
    errors.gender = genderValidation.error;
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
/**
 * Validate student profile form
 * @param {object} formData - Student profile form data
 * @returns {object} { isValid, errors }
 */
export const validateStudentProfileForm = (formData) => {
  const errors = {};
  // Base profile validations
  const profileValidation = validateProfileForm(formData);
  Object.assign(errors, profileValidation.errors);
  // Validate school name
  const schoolValidation = validateSchoolName(formData.schoolName, { required: true });
  if (!schoolValidation.isValid) {
    errors.schoolName = schoolValidation.error;
  }
  // Validate class
  const classValidation = validateClass(formData.className);
  if (!classValidation.isValid) {
    errors.className = classValidation.error;
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
/**
 * Calculate BMI (Body Mass Index)
 * @param {number} weight - Weight in kg
 * @param {number} height - Height in cm
 * @returns {object} { bmi, category, color }
 */
export const calculateBMI = (weight, height) => {
  if (!weight || !height || weight <= 0 || height <= 0) {
    return { bmi: null, category: 'Tidak tersedia', color: 'gray' };
  }
  // Convert height to meters
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  const roundedBMI = Math.round(bmi * 10) / 10;
  // Determine category
  let category, color;
  if (bmi < 18.5) {
    category = 'Kurus';
    color = 'warning';
  } else if (bmi < 25) {
    category = 'Normal';
    color = 'success';
  } else if (bmi < 30) {
    category = 'Gemuk';
    color = 'warning';
  } else {
    category = 'Obesitas';
    color = 'danger';
  }
  return { bmi: roundedBMI, category, color };
};
/**
 * Calculate age from birth date
 * @param {Date|string} birthDate - Birth date
 * @returns {object} { years, months, days }
 */
export const calculateAge = (birthDate) => {
  if (!birthDate) {
    return { years: 0, months: 0, days: 0 };
  }
  const birth = new Date(birthDate);
  const today = new Date();
  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  let days = today.getDate() - birth.getDate();
  if (days < 0) {
    months--;
    days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }
  return { years, months, days };
};
/**
 * Format age to string
 * @param {Date|string} birthDate - Birth date
 * @returns {string} Formatted age string
 */
export const formatAge = (birthDate) => {
  const { years, months } = calculateAge(birthDate);
  
  if (years === 0 && months === 0) {
    return 'Baru lahir';
  }
  
  if (years === 0) {
    return `${months} bulan`;
  }
  
  if (months === 0) {
    return `${years} tahun`;
  }
  
  return `${years} tahun ${months} bulan`;
};
export default {
  validateName,
  validateHeight,
  validateWeight,
  validateBirthDate,
  validateGender,
  validateBloodType,
  validateAddress,
  validateSchoolName,
  validateClass,
  validateProfileForm,
  validateStudentProfileForm,
  calculateBMI,
  calculateAge,
  formatAge,
};
