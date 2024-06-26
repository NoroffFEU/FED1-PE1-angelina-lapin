import { registerUser, loginUser } from "./user-management.mjs";
import { fetchBlogPosts } from "./blog-management.mjs";

document.addEventListener("DOMContentLoaded", function () {
  const registerForm = document.getElementById("register-form");
  const loginForm = document.getElementById("login-form");

  registerForm?.addEventListener("submit", function (event) {
    event.preventDefault();
    const username = document.getElementById("register-username").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;
    registerUser(username, email, password);
  });

  loginForm?.addEventListener("submit", function (event) {
    event.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    loginUser(email, password);
  });

  fetchBlogPosts().then(() => {
    document.querySelectorAll(".card").forEach((card) => {
      card.addEventListener("click", function (event) {
        event.preventDefault();
        const authToken = localStorage.getItem("authToken");
        const postId = this.querySelector("a").getAttribute("data-post-id");
        if (authToken && checkAdminRights(authToken)) {
          window.location.href = `/post/edit.html?id=${postId}`;
        } else {
          window.location.href = `/post/index.html?id=${postId}`;
        }
      });
    });
  });
});

function checkAdminRights(token) {
  const adminEmail = "anglapin01435@stud.noroff.no";
  const email = parseJwt(token).email;
  return email === adminEmail;
}

function parseJwt(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(jsonPayload);
}
