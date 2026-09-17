function preserved(value) {
  try {
    if (value < 0) throw new Error('retained exception');
    return 'retained:' + (value * 2);
  } catch (error) { return error.message; }
}
function original(value) { return 'old:' + value; }
print(preserved(3));
print(preserved(-1));
print(original(5));
