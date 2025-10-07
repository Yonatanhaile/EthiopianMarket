// Ethiopian phone number formatting and validation

export function formatPhoneNumber(phone) {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // If it starts with 251, format as +251 XX XXX XXXX
  if (cleaned.startsWith('251')) {
    const number = cleaned.substring(3);
    if (number.length === 9) {
      return `+251 ${number.substring(0, 2)} ${number.substring(2, 5)} ${number.substring(5)}`;
    }
  }
  
  // If it starts with 0, format as 0XX XXX XXXX
  if (cleaned.startsWith('0')) {
    if (cleaned.length === 10) {
      return `${cleaned.substring(0, 3)} ${cleaned.substring(3, 6)} ${cleaned.substring(6)}`;
    }
  }
  
  return phone;
}

export function validateEthiopianPhone(phone) {
  const cleaned = phone.replace(/\D/g, '');
  
  // Check if it's a valid Ethiopian phone number
  // Should be either 10 digits starting with 0, or 12 digits starting with 251
  if (cleaned.startsWith('251') && cleaned.length === 12) {
    return true;
  }
  
  if (cleaned.startsWith('0') && cleaned.length === 10) {
    return true;
  }
  
  return false;
}

export function normalizePhoneNumber(phone) {
  // Convert to international format +251
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.startsWith('251')) {
    return `+${cleaned}`;
  }
  
  if (cleaned.startsWith('0')) {
    return `+251${cleaned.substring(1)}`;
  }
  
  return phone;
}

export function getWhatsAppLink(phone) {
  const normalized = normalizePhoneNumber(phone).replace(/\D/g, '');
  return `https://wa.me/${normalized}`;
}

export function getTelegramLink(username) {
  // Remove @ if present
  const cleaned = username.replace('@', '');
  return `https://t.me/${cleaned}`;
}

