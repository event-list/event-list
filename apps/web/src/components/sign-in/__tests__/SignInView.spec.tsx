import '@testing-library/jest-dom';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MatchMediaMock from 'jest-matchmedia-mock';
import { RouterContext } from 'next/dist/shared/lib/router-context';

import { createMockRouter } from '../../../../test/createMockRouter';
import { WithProviders } from '../../../../test/withProviders';
import SignInView from '../SignInView';

let matchMedia;

beforeAll(() => {
  matchMedia = new MatchMediaMock();
});

afterEach(() => {
  matchMedia.clear();
});

it('should render the login form', async () => {
  render(
    <WithProviders>
      <SignInView />
    </WithProviders>,
  );

  expect(screen.getByLabelText('Email:', { exact: false })).toBeInTheDocument();
  expect(
    screen.getByLabelText('Password:', { exact: false }),
  ).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
});

it('should show an error if no password', async () => {
  render(
    <WithProviders>
      <SignInView />
    </WithProviders>,
  );

  const variables = {
    email: 'test@test.com',
    password: 'testpassword',
  };

  const loginButton = screen.getByRole('button', { name: 'Login' });
  const emailField = screen.getByLabelText('Email:', { exact: false });
  const passwordField = screen.getByLabelText('Password:', { exact: false });

  await act(async () => {
    await userEvent.type(emailField, variables.email);
  });

  await userEvent.click(passwordField);
  await userEvent.click(emailField);
  await userEvent.click(loginButton);

  await waitFor(() => {
    expect(emailField).toHaveValue(variables.email);
    expect(passwordField).toHaveValue('');
    expect(
      screen.getByText('Password is required', { exact: false }),
    ).toBeInTheDocument();
  });

  expect(screen.getByRole('button', { name: 'Login' })).toBeTruthy();
});

it('should show an error if not exists an user', async () => {
  render(
    <WithProviders>
      <SignInView />
    </WithProviders>,
  );

  const variables = {
    email: 'test@test.com',
    password: 'testpassword',
  };

  const loginButton = screen.getByRole('button', { name: 'Login' });
  const emailField = screen.getByLabelText('Email:', { exact: false });
  const passwordField = screen.getByLabelText('Password:', { exact: false });

  await act(async () => {
    await userEvent.type(emailField, variables.email);
    await userEvent.type(passwordField, variables.password);
  });

  await userEvent.click(loginButton);

  await waitFor(() => {
    expect(emailField).toHaveValue(variables.email);
    expect(passwordField).toHaveValue(variables.password);
    expect(
      screen.getByText('Something was wrong', { exact: false }),
    ).toBeInTheDocument();
  });

  expect(screen.getByRole('button', { name: 'Login' })).toBeTruthy();
});
