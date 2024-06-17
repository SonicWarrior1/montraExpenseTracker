import React, {useEffect} from 'react';
import {StyleSheet, Text} from 'react-native';
import {emailRegex, nameRegex, passRegex, STRINGS} from './strings';
import Sapcer from '../components/Spacer';
import Animated, {useSharedValue, withTiming} from 'react-native-reanimated';

export function ConfirmPassError({
  pass,
  confirmPass,
  formKey,
}: Readonly<{
  pass: string;
  confirmPass: string;
  formKey: boolean;
}>) {
  if (confirmPass !== '' && confirmPass !== pass) {
    return <Text style={style.error}>{STRINGS.PasswordDoNotMatch}</Text>;
  } else if (confirmPass === '' && formKey) {
    return (
      <Text style={style.error}>{STRINGS.ConfirmPasswordCannotBeEmpty}</Text>
    );
  } else {
    return <Sapcer height={25} />;
  }
}
export function testInput(re: RegExp, str: string): boolean {
  return re.test(str);
}

export function PassValidationError({
  pass,
  formKey,
}: Readonly<{pass: string; formKey: boolean}>) {
  if (!!pass && pass.length < 6) {
    return (
      <Text style={[style.error]} numberOfLines={1}>
        {STRINGS.PasswordNotValid}
      </Text>
    );
  } else if (pass === '' && formKey) {
    return (
      <Text style={[style.error]}>
        {STRINGS.PasswordCannotBeEmpty}
      </Text>
    );
  } else {
    return <Sapcer height={25} />;
  }
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
      {pass === '' && formKey ? (
        <Text style={style.error}>{STRINGS.PasswordCannotBeEmpty}</Text>
      ) : (
        <Sapcer height={25} />
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
  if (!!email && !testInput(emailRegex, email)) {
    return <Text style={style.error}>{STRINGS.EmailIsNotValid}</Text>;
  } else if (email === '' && formKey) {
    return <Text style={style.error}>{STRINGS.EmailCannotBeEmpty}</Text>;
  } else {
    return <Sapcer height={25} />;
  }
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
      {email === '' && formKey ? (
        <Text style={style.error}>{STRINGS.EmailCannotBeEmpty}</Text>
      ) : (
        <Sapcer height={25} />
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
  if (!!name && !testInput(nameRegex, name)) {
    return <Text style={style.error}>{STRINGS.NameIsNotValid}</Text>;
  } else if (name === '' && formKey) {
    return <Text style={style.error}>{STRINGS.NameCannotBeEmpty}</Text>;
  } else {
    return <Sapcer height={25} />;
  }
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
      {(value1 === '' || value2 === '') && formKey ? (
        <Text style={[style.error, {color: color, fontSize: size}]}>
          {errorText}
        </Text>
      ) : (
        <Sapcer height={24} />
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
      {value === '' && formKey ? (
        <Text style={[style.error, {color: color, fontSize: size, height: 24}]}>
          {errorText}
        </Text>
      ) : (
        <Sapcer height={24} />
      )}
    </>
  );
}
export function EmptyZeroError({
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
  const height = useSharedValue(24);
  useEffect(() => {
    if ((value === '' || Number(value) <= 0) && formKey) {
      height.value = withTiming(24);
    } else {
      height.value = withTiming(0);
    }
    console.log(height);
  }, [value, formKey]);
  return (
    <>
      {(value === '' || Number(value) <= 0) && formKey ? (
        <Animated.Text
          style={[
            style.error,
            {
              color: color,
              fontSize: size,
              height,
              marginTop: -20,
              marginBottom: 10,
            },
          ]}>
          {errorText}
        </Animated.Text>
      ) : (
        <Animated.View style={{height}}></Animated.View>
      )}
    </>
  );
}
export function AnimatedEmptyError({
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
  const height = useSharedValue(10);
  useEffect(() => {
    if (value === '' && formKey) {
      height.value = withTiming(24);
    } else {
      height.value = withTiming(10);
    }
    console.log(height.value);
  }, [value, formKey]);
  return (
    <>
      {value === '' && formKey ? (
        <Animated.Text
          style={[style.error, {color: color, fontSize: size, height}]}>
          {errorText}
        </Animated.Text>
      ) : (
        <Animated.View style={{height}}></Animated.View>
      )}
    </>
  );
}

const style = StyleSheet.create({
  error: {
    color: 'rgb(255,51,51)',
    fontSize: 12,
    paddingLeft: 12,
    paddingTop: 3,
    // justifyContent:"flex-end",
    alignSelf: 'flex-start',
    height: 25,
  },
});
