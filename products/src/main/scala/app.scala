import Database.writeNewProduct
import org.apache.commons.math3.distribution.ExponentialDistribution

object Main extends App {

  val SECONDS_PER_MINUTE = 60

  var waitTime: Int = 0

  while (true) {
    writeNewProduct()

    waitTime =
      ExponentialDistribution(1 * SECONDS_PER_MINUTE).sample().toInt * 1000
    Thread.sleep(waitTime)
  }
}
