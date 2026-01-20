---
title: rust for js developers
date: 2025-12-15
tags: [rust, javascript, learning, tutorial]
excerpt: the mental shift from garbage collection to ownership.
---

# rust for js developers

moving from javascript to rust felt like learning to code again. here is what clicked for me.

## no garbage collector

in js, you forget about memory. in rust, you own it.

```rust
let mut vec = Vec::new();
vec.push("hello");
```

the vector owns its memory. when it goes out of scope, memory is freed. no leaks, no gc pauses.

## ownership is the key

every value has one owner. when the owner is dropped, the value is dropped.

```rust
let s1 = String::from("hello");
let s2 = s1; // s1 is moved to s2
// println!("{}", s1); // error! s1 is no longer valid
```

this is not a reference. this is ownership transfer.

## borrowing

```rust
fn calculate_length(s: &String) -> usize {
    s.len()
} // s goes out of scope but nothing is dropped
```

references are borrowing. you cannot modify what you borrow unless you use `&mut`.

## the compiler is your friend

rust compiler errors are incredibly helpful:

```
error[E0382]: use of moved value: `vec`
   --> src/main.rs:10:13
    |
8  |     let vec = vec![1, 2, 3];
    |         --- move occurs because `vec` has type `Vec<i32>`, which does not implement the `Copy` trait
9  |     let vec2 = vec;
    |             --- value moved here
10 |     println!("{:?}", vec);
    |                     ^^^ value used after move
```

it tells you exactly what happened and how to fix it.

## tooling

- `cargo`: package manager, build tool, test runner
- `rustfmt`: automatic formatting
- `clippy`: linting
- `rust-analyzer`: the best language server i have ever used

## getting started

```bash
rustup init
cargo new my_project
cd my_project
cargo run
```

start small. the book is free at doc.rust-lang.org.

-- moli
