const validateForm = {
  validateFormAuth: ({ fullName, email, password, setError }) => {
    // Reset lỗi trước khi check
    setError({
      errorFullName: "",
      errorEmail: "",
      errorPassword: "",
    });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const onlyAlphaRegex =
      /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]+$/;

    let isValid = true;
    let errors = {};

    // 1. Chỉ validate fullName nếu giá trị này được truyền vào (khác undefined)
    if (fullName !== undefined) {
      const nameTrimmed = fullName?.trim();
      if (!nameTrimmed) {
        errors.errorFullName = "Full name is required";
        isValid = false;
      } else if (nameTrimmed.length < 3 || nameTrimmed.length > 50) {
        errors.errorFullName = "Full name must be between 3 and 50 characters";
        isValid = false;
      } else if (!onlyAlphaRegex.test(nameTrimmed)) {
        errors.errorFullName =
          "Full name cannot contain numbers or special characters";
        isValid = false;
      }
    }

    // 2. Validate Email
    const emailTrimmed = email?.trim();
    if (!emailTrimmed) {
      errors.errorEmail = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(emailTrimmed)) {
      errors.errorEmail = "Invalid email format";
      isValid = false;
    }

    // 3. Validate Password
    if (!password) {
      errors.errorPassword = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      errors.errorPassword = "Password must be at least 6 characters";
      isValid = false;
    }

    if (!isValid) {
      setError((prev) => ({ ...prev, ...errors }));
    }

    return isValid;
  },
  validateFormTeam: ({ formTeam, setError }) => {
    // Reset toàn bộ lỗi trước khi kiểm tra
    setError({
      errorName: "",
      errorCountry: "",
      errorDescription: "",
    });

    const alphaNumericRegex =
      /^[a-zA-Z0-9ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]+$/;
    const onlyAlphaRegex =
      /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]+$/;

    let isValid = true;
    let errors = {};

    // Validate Tên đội bóng
    const name = formTeam.name?.trim();
    if (!name) {
      errors.errorName = "Team name is required";
      isValid = false;
    } else if (name.length < 3 || name.length > 50) {
      errors.errorName = "Team name must be between 3 and 50 characters";
      isValid = false;
    } else if (!alphaNumericRegex.test(name)) {
      errors.errorName =
        "Team name cannot contain special characters (@, #, $...)";
      isValid = false;
    }

    // Validate Quốc gia
    const country = formTeam.country?.trim();
    if (!country) {
      errors.errorCountry = "Nationality is required";
      isValid = false;
    } else if (country.length < 3 || country.length > 50) {
      errors.errorCountry = "Nationality must be between 3 and 50 characters";
      isValid = false;
    } else if (!onlyAlphaRegex.test(country)) {
      errors.errorCountry =
        "Nationality can only contain letters, no numbers or special characters";
      isValid = false;
    }

    // Validate Mô tả
    const desc = formTeam.description?.trim();
    if (!desc) {
      errors.errorDescription = "Description is required";
      isValid = false;
    } else if (desc.length < 3 || desc.length > 50) {
      errors.errorDescription =
        "Description must be between 3 and 50 characters";
      isValid = false;
    } else if (!alphaNumericRegex.test(desc)) {
      errors.errorDescription = "Description cannot contain special characters";
      isValid = false;
    }

    // Nếu có lỗi, cập nhật một lần duy nhất vào State
    if (!isValid) {
      setError((prev) => ({ ...prev, ...errors }));
    }

    return isValid;
  },
};

export default validateForm;
