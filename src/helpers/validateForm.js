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
        errors.errorFullName = "Họ và tên không được để trống";
        isValid = false;
      } else if (nameTrimmed.length < 3 || nameTrimmed.length > 50) {
        errors.errorFullName = "Họ và tên phải từ 3 đến 50 ký tự";
        isValid = false;
      } else if (!onlyAlphaRegex.test(nameTrimmed)) {
        errors.errorFullName = "Họ tên không được chứa số hay ký tự đặc biệt";
        isValid = false;
      }
    }

    // 2. Validate Email
    const emailTrimmed = email?.trim();
    if (!emailTrimmed) {
      errors.errorEmail = "Email không được để trống";
      isValid = false;
    } else if (!emailRegex.test(emailTrimmed)) {
      errors.errorEmail = "Email không đúng định dạng";
      isValid = false;
    }

    // 3. Validate Password
    if (!password) {
      errors.errorPassword = "Mật khẩu không được để trống";
      isValid = false;
    } else if (password.length < 6) {
      errors.errorPassword = "Mật khẩu tối thiểu 6 ký tự";
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
      errors.errorName = "Tên đội bóng không được để trống";
      isValid = false;
    } else if (name.length < 3 || name.length > 50) {
      errors.errorName = "Tên đội bóng phải từ 3 đến 50 ký tự";
      isValid = false;
    } else if (!alphaNumericRegex.test(name)) {
      errors.errorName = "Tên không được chứa ký tự đặc biệt (@, #, $...)";
      isValid = false;
    }

    // Validate Quốc gia
    const country = formTeam.country?.trim();
    if (!country) {
      errors.errorCountry = "Vui lòng nhập Quốc gia";
      isValid = false;
    } else if (country.length < 3 || country.length > 50) {
      errors.errorCountry = "Quốc gia phải từ 3 đến 50 ký tự";
      isValid = false;
    } else if (!onlyAlphaRegex.test(country)) {
      errors.errorCountry =
        "Quốc gia chỉ được chứa chữ cái, không chứa số hay ký tự đặc biệt";
      isValid = false;
    }

    // Validate Mô tả
    const desc = formTeam.description?.trim();
    if (!desc) {
      errors.errorDescription = "Vui lòng nhập mô tả";
      isValid = false;
    } else if (desc.length < 3 || desc.length > 50) {
      errors.errorDescription = "Mô tả phải từ 3 đến 50 ký tự";
      isValid = false;
    } else if (!alphaNumericRegex.test(desc)) {
      errors.errorDescription = "Mô tả không được chứa ký tự đặc biệt";
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
