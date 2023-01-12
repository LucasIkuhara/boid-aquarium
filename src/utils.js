const vec3 = glMatrix.vec3;

/**
 * Represents an orientation using a heading vector (axis) and an angle.
 * @typedef {object} AxisAngle
 * @property {number[]} axis A unit-vector of size 3 representing the heading of an object.
 * @property {number} angle An angle between (-2 x Pi) and (2 x Pi) representing the rotation along the axis vector.
*/

/**
 * Represents the pose of an object. Contains their position and orientation.
 * @typedef {object} Pose
 * @property {number[]} position Represents the position of the object.
 * @property {AxisAngle} orientation Represents the orientation of the object.
*/

/**
 * Applies random noise to the given vector.
 * 
 * @param {readonly number[]} x The input vector
 * @param {number} scale The scale (norm) of the noise vector.
 * @param {boolean} normalize Wether to normalize the output.
 * Will always return a unit-vector if enabled. Defaults to true.
 * 
 * @returns {number[]} The original vector with noise applied to it.
 */
export function applyNoiseToVec3(x, scale, normalize=true) {

    // Add noise
    let noisyVec = vec3.add([], 
        x, 
        vec3.random([], scale)
    )

    // Transform to a unit-vector
    if (normalize)
        noisyVec = vec3.normalize([], noisyVec);

    return noisyVec;
}

/**
 * Applies random noise to the given axis-angle.
 * 
 * @param {readonly AxisAngle} x The input value.
 * @param {number} scale The scale as percentage of the noise added.
 * @param {boolean} normalize Wether to normalize the output.
 * Will always return a unit-vector and an angle in [-2.Pi, 2.Pi] if enabled. Defaults to true.
 * 
 * @returns {AxisAngle} The original value with noise applied to it.
 */
export function applyNoiseToAxisAngle(x, scale, normalize=true) {

    const newAxis = applyNoiseToVec3(x.axis, scale, normalize);
    let newAngle = x.angle + random(scale*2*Math.PI);

    if (normalize)
        newAngle = newAngle % (2 * Math.PI);

    return {
        axis: newAxis,
        angle: newAngle
    }
}

/**
 * Performs linear interpolation between two numbers, following the rule:
 * y(a, b) = (1 - factor)*a + factor*b.
 * @param {number} a First operand.
 * @param {number} b Second operand.
 * @param {number} factor The interpolation strength from 0 to 1.
 */
export function lerp(a, b, factor) {

    // make sure the factor is between 0 and 1.
    factor = Math.min(1, factor)
    factor = Math.max(0, factor)

    const value = (1-factor)*a + factor*b;
    return value
}

/**
 * Converts an orientation from the Axis-Angle representation to a unit Quaternion.
 * Reference: https://danceswithcode.net/engineeringnotes/quaternions/quaternions.html
 * 
 * @param {AxisAngle} x The input axis-angle rotation.
 * @returns {number[]} A quaternion representing the same rotation.
 */
export function quaternionFromAxisAngle(x) {

    // const theta = Math.PI/2//isNaN(x.angle/2) ? 0 : x.angle/2;
    // const factor = Math.sin(theta);
    // // console.log(theta)
    // const axis = vec3.scale([], x.axis, factor);
    // const value = glMatrix.quat.fromValues(...axis, Math.cos(theta));
    
    const ori = glMatrix.quat.setAxisAngle([], x.axis, Math.PI )
    // return value;
    return glMatrix.quat.add([], ori, glMatrix.quat.fromEuler([], 90, 0, 0))
} 

/**
 * Generates a random number, either positive or negative in the scale given [scale, scale]
 * @param {number} scale 
 * @returns A random number.
*/
export function random(scale) {
    return ((Math.random()*2)-1)*scale;
    
}
