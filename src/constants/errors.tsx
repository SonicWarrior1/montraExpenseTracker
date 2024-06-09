import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {emailRegex, nameRegex, passRegex} from './strings';
import Sapcer from '../components/Spacer';

export function ConfirmPassError({
  pass,
  confirmPass,
  formKey,
}: Readonly<{
  pass: string;
  confirmPass: string;
  formKey: boolean;
}>) {
  return (
    <>
      <Sapcer height={10} />
      {confirmPass !== '' && confirmPass !== pass && (
        <Text style={style.error}>Password do not match</Text>
      )}
      {confirmPass === '' && formKey && (
        <Text style={style.error}>Confirm Password cannot be Empty</Text>
      )}
    </>
  );
}
export function testInput(re: RegExp, str: string): boolean {
  return re.test(str);
}

export function PassValidationError({
  pass,
  formKey,
}: Readonly<{pass: string; formKey: boolean}>) {
  return (
    <>
      <Sapcer height={10} />
      {!!pass && !testInput(passRegex, pass) && (
        <Text style={style.error}>
          Password must contain atleast 1 Uppercase, 1 Lowercase, 1 Numeric and
          1 Symbol Character
        </Text>
      )}
      {pass === '' && formKey && (
        <Text style={style.error}>Password cannot be Empty</Text>
      )}
    </>
  );
}

export function PassEmptyError({
  pass,
  formKey,
}: Readonly<{
  pass: string;
  formKey: boolean;
}>) {
  return (
    <>
      <Sapcer height={10} />
      {pass === '' && formKey && (
        <Text style={style.error}>Password cannot be Empty</Text>
      )}
    </>
  );
}

export function EmailValError({
  email,
  formKey,
}: Readonly<{
  email: string;
  formKey: boolean;
}>) {
  return (
    <>
      <Sapcer height={10} />
      {!!email && !testInput(emailRegex, email) && (
        <Text style={style.error}>Email is not Valid</Text>
      )}
      {email === '' && formKey && (
        <Text style={style.error}>Email cannot be Empty</Text>
      )}
    </>
  );
}
export function EmailEmptyError({
  email,
  formKey,
}: Readonly<{
  email: string;
  formKey: boolean;
}>) {
  return (
    <>
      <Sapcer height={10} />

      {email === '' && formKey && (
        <Text style={style.error}>Email cannot be Empty</Text>
      )}
    </>
  );
}

export function NameValError({
  name,
  formKey,
}: Readonly<{
  name: string;
  formKey: boolean;
}>) {
  return (
    <>
      <Sapcer height={10} />
      {!!name && !testInput(nameRegex, name) && (
        <Text style={style.error}>Name is not Valid</Text>
      )}
      {name === '' && formKey && (
        <Text style={style.error}>Name cannot be Empty</Text>
      )}
    </>
  );
}
export function CompundEmptyError({
  value1,
  value2,
  formKey,
  errorText,
  color = 'rgb(255,51,51)',
  size = 12,
}: Readonly<{
  value1: string;
  value2: string;
  formKey: boolean;
  errorText: string;
  color?: string;
  size?: number;
}>) {
  return (
    <>
      <Sapcer height={10} />
      {(value1 === '' || value2 === '') && formKey && (
        <Text style={[style.error, {color: color, fontSize: size}]}>
          {errorText}
        </Text>
      )}
    </>
  );
}
export function EmptyError({
  value,
  formKey,
  errorText,
  color = 'rgb(255,51,51)',
  size = 12,
}: Readonly<{
  value: string;
  formKey: boolean;
  errorText: string;
  color?: string;
  size?: number;
}>) {
  return (
    <>
      <Sapcer height={10} />
      {value === '' && formKey && (
        <Text style={[style.error, {color: color, fontSize: size}]}>
          {errorText}
        </Text>
      )}
    </>
  );
}

const style = StyleSheet.create({
  error: {
    color: 'rgb(255,51,51)',
    fontSize: 12,
    paddingLeft: 12,
    marginTop: -5,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
});
