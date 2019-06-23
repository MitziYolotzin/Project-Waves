
export const validate = (element, formdata = [] ) => {
let error = [true,''];

if(element.validation.email){
    const valid = /\S+@\S+\.\S+/.test(element.value);
    const message = `${!valid ? 'Must be a valid email':'' }`;
    error = !valid ? [valid,message] : error;    
}


if(element.validation.required){
const valid = element.value.trim() !== '';
const message = `${!valid ? 'This field is required':'' }`;
error = !valid ? [valid,message] : error;

}
return error

}

export const update = (element, formdata, formName) => {
const newFormdata = {
    ...formdata
}

//data to be equal from ...formdata
const newElement = {
    ...newFormdata[element.id]
}

newElement.value = element.event.target.value;

if(element.blur){
//touched property, login component

let validData = validate(newElement,formdata);
newElement.valid = validData[0];
newElement.validationMessage = validData[1];

}

newElement.touched = element.blur;
newFormdata[element.id] = newElement;

return newFormdata;


}