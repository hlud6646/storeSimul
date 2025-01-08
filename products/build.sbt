val scala3Version = "3.6.2"

lazy val root = project
  .in(file("."))
  .settings(
    name := "products",
    version := "0.1.0-SNAPSHOT",
    scalaVersion := scala3Version,
    libraryDependencies ++= List(
      "com.github.javafaker" % "javafaker" % "1.0.2",
      "org.postgresql" % "postgresql" % "42.2.24",
      "org.apache.commons" % "commons-math3" % "3.6.1",
      "ch.qos.logback" % "logback-classic" % "1.2.10"
    ),
    watchTriggeredMessage := Watch.clearScreenOnTrigger,
    fork := true
  )
