import { defineRule } from "vee-validate";
import i18n from "@/plugins/i18n";
// const langdic = {
//   arabic: /[\u0600-\u06FF]/,
//   persian: /[\u0750-\u077F]/,
//   Hebrew: /[\u0590-\u05FF]/,
//   Syriac: /[\u0700-\u074F]/,
//   Bengali: /[\u0980-\u09FF]/,
//   Ethiopic: /[\u1200-\u137F]/,
//   "Greek and Coptic": /[\u0370-\u03FF]/,
//   Georgian: /[\u10A0-\u10FF]/,
//   Thai: /[\u0E00-\u0E7F]/,
//   english: /^[a-zA-Z]+$/,
//   //add other languages her
// };

defineRule("required", (value, [], context) => {
  if (typeof value === "number") {
    return true;
  }
  return !!value || `${context.field} is required`;
});

defineRule("lenInterval", (value, [], context) => {
  if (
    value.length >= context.rule.params[0] &&
    value.length <= context.rule.params[1]
  ) {
    return true;
  } else {
    let show =
      context.rule.params[0] == context.rule.params[1]
        ? `length must be ${context.rule.params[0]}`
        : `length must be between ${context.rule.params[0]} - ${context.rule.params[1]}`;
    return `${context.field} ${show}`;
  }
});

defineRule("minLength", (value, [], context) => {
  if (value.length >= context.rule.params[0]) {
    return true;
  } else {
    return `${context.field} is must be greater than ${context.rule.params[0]}`;
  }
});

defineRule("email", (value) => {
  return (
    !value ||
    /[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(
      value
    ) ||
    i18n.global.t("invalid_email")
  );
});

defineRule("password", (value) => {
  return !value || value.length >= 8 || i18n.global.t("password_too_short");
});

defineRule("confirm", (value, [other]) => {
  return !value || value === other || i18n.global.t("passwords_do_not_match");
});

defineRule("ethiopian_phone", (value) => {
  return !value || /^\+251\d{9}$/.test(value) || i18n.global.t("invalid_phone");
});

defineRule("validPassword", (value) => {
  const strongRegex = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
  );
  return (
    !value ||
    strongRegex.test(value) ||
    "The password should contain letters, numbers, uppercase and special symbols."
  );
});
defineRule("number", (value) => {
  return !value || /^[0-9]+$/.test(value) || i18n.global.t("Numbers Only");
});

defineRule("amChar", (value) => {
  return (
    !value ||
    /[\u1200-\u137F]/.test(value.replace(/\s/g)) ||
    "This filed only accepts Amharic characters"
  );
});

defineRule("enChar", (value) => {
  return (
    !value ||
    !/[\u1200-\u137F]/.test(value.replace(/\s/g)) ||
    "This filed only accepts English characters"
  );
});

defineRule("checkMinimumInMax", (value, [other]) => {
  if (other) {
    return (
      !value ||
      parseInt(value) >= parseInt(other) ||
      i18n.global.t("max_and_min_check")
    );
  }
  return true;
});
