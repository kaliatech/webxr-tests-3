<template>
  <header style="z-index: 1000">
    <!-- Fixed navbar -->
    <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark" style="z-index: 5000">
      <div class="container">
        <router-link class="navbar-brand" to="/">WebXR</router-link>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarCollapse"
          aria-controls="navbarCollapse"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
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
                class="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Tests
              </a>
              <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                <!--                <a class="dropdown-item" href="#">Test 1</a>-->
                <router-link class="dropdown-item" to="/test1">Test 1 - Simple</router-link>
                <router-link class="dropdown-item" to="/test2">Test 2 - Interactions</router-link>
                <router-link class="dropdown-item" to="/test3">Test 3 - Transitions</router-link>
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
