<template>
  <header style="z-index: 1000">
    <!-- Fixed navbar -->
    <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
      <div class="container">
        <router-link class="navbar-brand" to="/">WebXR</router-link>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarCollapse"
          aria-controls="navbarCollapse"
          aria-expanded="false"
          aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div id="navbarCollapse" class="collapse navbar-collapse">
          <ul class="navbar-nav me-auto mb-2 mb-md-0">
            <!--            <li class="nav-item">-->
            <!--              <router-link class="nav-link" to="/test01">Test 1</router-link>-->
            <!--            </li>-->
            <li class="nav-item dropdown">
              <a
                id="navbarDropdown"
                class="nav-link dropdown-toggle p-2"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false">
                Tests
              </a>
              <div class="dropdown-menu p5" aria-labelledby="navbarDropdown">
                <!--                <a class="dropdown-item" href="#">Test 1</a>-->
                <router-link class="dropdown-item p-2" to="/test1">Test 1 - Simple</router-link>
                <router-link class="dropdown-item p-2" to="/test2">Test 2 - Picking &amp; Highlights</router-link>
                <router-link class="dropdown-item p-2" to="/test3">Test 3 - Scene Transitions</router-link>
                <router-link class="dropdown-item p-2" to="/test4">Test 4 - Photo & Video</router-link>
                <router-link class="dropdown-item p-2" to="/test5">Test 5 - Menus &amp; UI Panels</router-link>
                <!--                <a class="dropdown-item" href="#">Another action</a>-->
                <!--                <div class="dropdown-divider"></div>-->
                <!--                <a class="dropdown-item" href="#">Something else here</a>-->
              </div>
            </li>
          </ul>
          <!-- <form class="d-flex">
            <input
              class="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <button class="btn btn-outline-success" type="submit">
              Search
            </button>
          </form> -->
        </div>
      </div>
    </nav>
  </header>
</template>
