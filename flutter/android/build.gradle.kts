allprojects {
    repositories {
        google()
        mavenCentral()
        // The native DimensionX Android SDK the plugin depends on is served from
        // this maven repository. It has to be declared by the app: Gradle
        // resolves a plugin's dependencies with the consuming project's
        // repositories, so the plugin's own declaration is not enough.
        maven { url = uri("https://dl.dimx.world/sdk/android") }
    }
}

val newBuildDir: Directory =
    rootProject.layout.buildDirectory
        .dir("../../build")
        .get()
rootProject.layout.buildDirectory.value(newBuildDir)

subprojects {
    val newSubprojectBuildDir: Directory = newBuildDir.dir(project.name)
    project.layout.buildDirectory.value(newSubprojectBuildDir)
}
subprojects {
    project.evaluationDependsOn(":app")
}

tasks.register<Delete>("clean") {
    delete(rootProject.layout.buildDirectory)
}
