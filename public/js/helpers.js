 function getColor(index) {

    // Use a modulus operation to ensure the hue wraps around at 360
    const hue = (index * 137.508) % 360; // 137.508 is a magic number known as the golden angle
    const saturation = 70; // percentage
    const lightness = 50; // percentage

    // Return the HSL color as a string
    const backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%, 0.5)`;
    const borderColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    return {
        backgroundColor,
        borderColor
    };
}