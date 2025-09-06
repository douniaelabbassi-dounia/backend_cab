import './bootstrap';

import Alpine from 'alpinejs';

window.Alpine = Alpine;

Alpine.start();

// DARK MODE TOGGLE BUTTON
// var themeToggleDarkIcons = document.getElementsByClassName("dark-icon-class");
// var themeToggleLightIcons = document.getElementsByClassName("light-icon-class");

// if (
//     localStorage.getItem("color-theme") === "dark" ||
//     (!localStorage.getItem("color-theme") &&
//         window.matchMedia("(prefers-color-scheme: dark)").matches)
// ) {
//     // Loop through each element in the collection and remove the "hidden" class
//     Array.from(themeToggleLightIcons).forEach(function (element) {
//         element.classList.remove("hidden");
//     });
// } else {
//     // Loop through each element in the collection and remove the "hidden" class
//     Array.from(themeToggleDarkIcons).forEach(function (element) {
//         element.classList.remove("hidden");
//     });
// }

// // Add event listener to each element in the collection
// Array.from(document.getElementsByClassName("switch-theme-btn-class")).forEach(function (element) {
//     element.addEventListener("click", function () {
//         // Toggle "hidden" class for dark and light icons
//         Array.from(themeToggleDarkIcons).forEach(function (element) {
//             element.classList.toggle("hidden");
//         });
//         Array.from(themeToggleLightIcons).forEach(function (element) {
//             element.classList.toggle("hidden");
//         });

//         // Update localStorage and classList for documentElement
//         if (localStorage.getItem("color-theme")) {
//             if (localStorage.getItem("color-theme") === "light") {
//                 document.documentElement.classList.add("dark");
//                 localStorage.setItem("color-theme", "dark");
//             } else {
//                 document.documentElement.classList.remove("dark");
//                 localStorage.setItem("color-theme", "light");
//             }
//         } else {
//             if (document.documentElement.classList.contains("dark")) {
//                 document.documentElement.classList.remove("dark");
//                 localStorage.setItem("color-theme", "light");
//             } else {
//                 document.documentElement.classList.add("dark");
//                 localStorage.setItem("color-theme", "dark");
//             }
//         }
//     });
// });
