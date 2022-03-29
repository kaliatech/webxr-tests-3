<template>
  <header style="z-index: 1000">
    <!-- Fixed navbar -->
    <nav class="navbar navbar-expand-md navbar-dark bg-dark" style="z-index: 1001">
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
                <router-link class="dropdown-item p-2" to="/test1">Test 1 - Simple XR Setup</router-link>
                <router-link class="dropdown-item p-2" to="/test2">Test 2 - Picking &amp; Highlight Layers</router-link>
                <router-link class="dropdown-item p-2" to="/test3">Test 3 - Scene Loading/Unloading</router-link>
                <router-link class="dropdown-item p-2" to="/test4">Test 4 - Photo & Video (non-layer)</router-link>
                <router-link class="dropdown-item p-2" to="/test5">Test 5 - Menus &amp; UIs (non-layer)</router-link>
                <router-link class="dropdown-item p-2" to="/test6">Test 6 - PBR Materials</router-link>
                <div class="dropdown-divider"></div>
                <!--                <router-link class="dropdown-item p-2" to="/">Test 6 - PBR Materials</router-link>-->
                <!--                <router-link class="dropdown-item p-2" to="/">Test 7 - WebXR Layers - UI</router-link>-->
                <!--                <router-link class="dropdown-item p-2" to="/">Test 8 - WebXR Media Layers</router-link>-->
                <!--                <router-link class="dropdown-item p-2" to="/">Test 9 - WebXR Multiview</router-link>-->
                <router-link class="dropdown-item p-2" to="/tests-future">Future Tests (maybe)</router-link>
              </div>
            </li>

            <li class="nav-item dropdown">
              <a
                id="navbarDropdown-experiments"
                class="nav-link dropdown-toggle p-2"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false">
                Experiments
              </a>
              <div class="dropdown-menu p5" aria-labelledby="navbarDropdown-experiments">
                <router-link class="dropdown-item p-2" to="/experiment1">Experiment 1 - Trees</router-link>
                <div class="dropdown-divider"></div>
                <router-link class="dropdown-item p-2" to="/experiments-future">Future Experiments (Maybe)</router-link>
              </div>
            </li>

            <li class="nav-item">
              <router-link class="nav-link p-2" to="/about">About</router-link>
            </li>
          </ul>

          <ul class="navbar-nav ml-auto mb-2 mb-md-0">
            <li class="nav-item">
              <a class="nav-link ml-auto p-0" href="https://github.com/kaliatech/webxr-tests-3">
                <!--                <i class="bi-github" role="img" aria-label="GitHub"></i>-->
                <!--                <svg :src="githubIcon" class="icon text-success" role="img" aria-label="GitHub" />-->
                <GithubIcon class="icon ms-2" viewBox="0 0 16 16" role="img" aria-label="GitHub" />
              </a>
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
<script setup lang="ts">
import GithubIcon from '../../node_modules/bootstrap-icons/icons/github.svg?component'
</script>
<style>
.icon {
  color: white;
  width: 1.5rem;
  height: 1.5rem;
}
</style>
