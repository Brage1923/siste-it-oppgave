
export function getCustomProperty(element, propertyName) {
    return parseFloat(getComputedStyle(element).getPropertyValue(propertyName)) || 0
}

export function setCustomProperty(element, propertyName, value) {
    element.style.setProperty(propertyName, value)
}

export function incrementCustomProperty(element, propertyName, increment) {
    setCustomProperty(element, propertyName, getCustomProperty(element, propertyName) + increment)
}