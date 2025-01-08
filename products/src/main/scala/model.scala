import com.github.javafaker.{Faker}
import java.util.Locale

case class Product(
    name: String,
    material: String,
    color: String,
    department: String
)
object Product {
  private val faker = new Faker(new Locale("en-AU"))

  def random() = {
    new Product(
      faker.commerce().productName(),
      faker.commerce().material(),
      faker.commerce().color(),
      faker.commerce().department()
    )
  }
}
