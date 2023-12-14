import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import IletisimFormu from "./IletisimFormu";

beforeEach(() => {
  render(<IletisimFormu />);
});

test("hata olmadan render ediliyor", () => {
  // render(<IletisimFormu />);
});

test("iletişim formu headerı render ediliyor", () => {
  //render(<IletisimFormu />);

  const header = screen.getByText("İletişim Formu");
  expect(header).toBeInTheDocument();
  expect(header).toBeTruthy();
  expect(header).toHaveTextContent(/İletişim formu/i);
});

test("kullanıcı adını 5 karakterden az girdiğinde BİR hata mesajı render ediyor.", async () => {
  //render(<IletisimFormu />);

  const isimAlani = screen.getByLabelText("Ad*");
  userEvent.type(isimAlani, "123");

  const hataMesajlari = await screen.findAllByTestId("error");
  expect(hataMesajlari).toHaveLength(1);
});

test("kullanıcı inputları doldurmadığında ÜÇ hata mesajı render ediliyor.", async () => {
  const gonderButonu = screen.getByRole("button");
  userEvent.click(gonderButonu);

  /* const hataMesajlari = await screen.findAllByTestId("error");
  expect(hataMesajlari).toHaveLength(3); */

  await waitFor(() => {
    const hataMesajlari = screen.queryAllByTestId("error");
    expect(hataMesajlari).toHaveLength(3);
  });
});

test("kullanıcı doğru ad ve soyad girdiğinde ama email girmediğinde BİR hata mesajı render ediliyor.", async () => {
  const isimAlani = screen.getByLabelText("Ad*");
  userEvent.type(isimAlani, "Aytekin");

  const soyIsimAlani = screen.getByLabelText("Soyad*");
  userEvent.type(soyIsimAlani, "ozis");

  const gonderButonu = screen.getByRole("button");
  userEvent.click(gonderButonu);

  await waitFor(() => {
    const hataMesajlari = screen.queryAllByTestId("error");
    expect(hataMesajlari).toHaveLength(1);
  });
});

test('geçersiz bir mail girildiğinde "email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', async () => {
  const email = screen.getByLabelText("Email*");
  userEvent.type(email, "abcabc");

  await waitFor(() => {
    const hataMesajlari = screen.queryByTestId("error");
    expect(hataMesajlari).toHaveTextContent(
      "Hata: email geçerli bir email adresi olmalıdır."
    );
  });
});

test('soyad girilmeden gönderilirse "soyad gereklidir." mesajı render ediliyor', async () => {
  const isimAlani = screen.getByLabelText("Ad*");
  userEvent.type(isimAlani, "Aytekin");

  const email = screen.getByLabelText("Email*");
  userEvent.type(email, "abcabc@abc.com");

  const gonderButonu = screen.getByRole("button");
  userEvent.click(gonderButonu);

  const hataMesaji = await screen.findByText(/soyad gereklidir./);
  expect(hataMesaji).toBeInTheDocument();
});

test("ad,soyad, email render ediliyor. mesaj bölümü doldurulmadığında hata mesajı render edilmiyor.", async () => {
  const isimAlani = screen.getByLabelText("Ad*");
  userEvent.type(isimAlani, "Aytekin");

  const soyIsimAlani = screen.getByLabelText("Soyad*");
  userEvent.type(soyIsimAlani, "ozis");

  const email = screen.getByLabelText("Email*");
  userEvent.type(email, "abcabc@abc.com");

  const gonderButonu = screen.getByRole("button");
  userEvent.click(gonderButonu);

  await waitFor(() => {
    const hataMesajlari = screen.queryAllByTestId("error");
    expect(hataMesajlari).toHaveLength(0);
    const nameDisplay = screen.getByTestId("firstnameDisplay");
    const lasNameDisplay = screen.getByTestId("lastnameDisplay");
    const emailDisplay = screen.getByTestId("emailDisplay");
    const messageDisplay = screen.queryByTestId("messageDisplay");
    expect(nameDisplay).toHaveTextContent("Aytekin");
    expect(lasNameDisplay).toHaveTextContent("ozis");
    expect(emailDisplay).toHaveTextContent("abcabc@abc.com");
    expect(messageDisplay).not.toBeInTheDocument();
  });
});

test("form gönderildiğinde girilen tüm değerler render ediliyor.", async () => {
  const isimAlani = screen.getByLabelText("Ad*");
  userEvent.type(isimAlani, "Aytekin");

  const soyIsimAlani = screen.getByLabelText("Soyad*");
  userEvent.type(soyIsimAlani, "ozis");

  const email = screen.getByLabelText("Email*");
  userEvent.type(email, "abcabc@abc.com");

  const message = screen.getByLabelText("Mesaj");
  userEvent.type(message, "selam");

  const gonderButonu = screen.getByRole("button");
  userEvent.click(gonderButonu);

  await waitFor(() => {
    const hataMesajlari = screen.queryAllByTestId("error");
    expect(hataMesajlari).toHaveLength(0);
    const nameDisplay = screen.getByTestId("firstnameDisplay");
    const lasNameDisplay = screen.getByTestId("lastnameDisplay");
    const emailDisplay = screen.getByTestId("emailDisplay");
    const messageDisplay = screen.getByTestId("messageDisplay");
    expect(nameDisplay).toHaveTextContent("Aytekin");
    expect(lasNameDisplay).toHaveTextContent("ozis");
    expect(emailDisplay).toHaveTextContent("abcabc@abc.com");
    expect(messageDisplay).toHaveTextContent("selam");
  });
});
