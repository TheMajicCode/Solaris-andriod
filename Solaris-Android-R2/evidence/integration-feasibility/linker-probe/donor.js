function replacement(value) {
  var secret = 7;
  function nested(amount) { return 'patched:' + (value + amount + secret); }
  try {
    if (value < 0) throw new Error('new exception');
    return nested(4);
  } catch (error) { return error.message; }
}
