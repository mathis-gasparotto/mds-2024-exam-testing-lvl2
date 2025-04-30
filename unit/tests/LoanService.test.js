import { describe, it, expect, beforeEach } from "vitest";
import { LoanService } from "../src/LoanService";
import { Book } from "../src/Book";
import { User } from "../src/User";

describe("LoanService", () => {
  let loanService;

  beforeEach(() => {
    loanService = new LoanService();
  });

  it("should add a book", () => {
    const book = new Book("1", "Book Title", "Author Name");
    loanService.addBook(book);
    expect(loanService.getBook("1")).toEqual(book);
  });

  it("should not add a book with the same id", () => {
    const book = new Book("1", "Book Title", "Author Name");
    loanService.addBook(book);
    const reAddBookFn = () => loanService.addBook(book);
    expect(reAddBookFn).toThrow("Book already exists");
  });

  it("should add a user", () => {
    const user = new User("1", "John Doe", "john.doe@example.com");
    loanService.addUser(user);
    expect(loanService.getUser("1")).toEqual(user);
  });

  it("should not add a user with the same id", () => {
    const user = new User("1", "John Doe", "john.doe@example.com");
    loanService.addUser(user);
    const reAddUserFn = () => loanService.addUser(user);
    expect(reAddUserFn).toThrow("User already exists");
  });

  it("should borrow a book", () => {
    const book = new Book("1", "Book Title", "Author Name");
    const user = new User("1", "John Doe", "john.doe@example.com");

    loanService.addBook(book);
    loanService.addUser(user);
    const borrowResult = loanService.borrowBook("1", "1");

    expect(borrowResult).toBe(true);
    expect(loanService.getBook("1").isAvailable()).toBe(false);
    expect(loanService.getUser("1").currentLoans).toEqual(["1"]);
  });

  it("should calculate due date for standard user", () => {
    const borrowDate = new Date();
    const dueDate = loanService.calculateDueDate(borrowDate, "standard");
    const days = 14;
    expect(dueDate).toEqual(
      new Date(borrowDate.getTime() + days * 24 * 60 * 60 * 1000)
    );
  });

  it("should calculate due date for premium user", () => {
    const borrowDate = new Date();
    const dueDate = loanService.calculateDueDate(borrowDate, "premium");
    const days = 30;
    expect(dueDate).toEqual(
      new Date(borrowDate.getTime() + days * 24 * 60 * 60 * 1000)
    );
  });

  it("should calculate due date for employee user", () => {
    const borrowDate = new Date();
    const dueDate = loanService.calculateDueDate(borrowDate, "employee");
    const days = 60;
    expect(dueDate).toEqual(
      new Date(borrowDate.getTime() + days * 24 * 60 * 60 * 1000)
    );
  });

  it("should calculate penalty for no overdue book", () => {
    const book = new Book("1", "Book Title", "Author Name");
    const user = new User("1", "John Doe", "john.doe@example.com");

    loanService.addBook(book);
    loanService.addUser(user);
    loanService.borrowBook("1", "1");
    const penalty = loanService.calculatePenalty(book, new Date());
    expect(penalty).toBe(0);
  });

  it("should calculate penalty for overdue book", () => {
    const book = new Book("1", "Book Title", "Author Name");
    const user = new User("1", "John Doe", "john.doe@example.com");

    loanService.addBook(book);
    loanService.addUser(user);
    loanService.borrowBook("1", "1");
    const daysLate = 15;
    const returnDate = new Date(book.dueDate);
    returnDate.setDate(returnDate.getDate() + daysLate);
    const penalty = loanService.calculatePenalty(book, returnDate);
    expect(penalty).toBe(0.5 * daysLate);
  });
});
