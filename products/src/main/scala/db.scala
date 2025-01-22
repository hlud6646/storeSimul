import Product._

import java.sql.{Connection, DriverManager, ResultSet}
import org.slf4j.LoggerFactory

object Database {
  val logger = LoggerFactory.getLogger(Main.getClass)
  def writeNewProduct(connection: Connection) = {
    val statement = connection.createStatement()
    val sql =
      "INSERT INTO product (name, material, color, department, inventory) VALUES (?, ?, ?, ?, ?)"
    val preparedStatement = connection.prepareStatement(sql)

    val product = Product.random()
    preparedStatement.setString(1, product.name)
    preparedStatement.setString(2, product.material)
    preparedStatement.setString(3, product.color)
    preparedStatement.setString(4, product.department)
    preparedStatement.setInt(5, product.inventory)

    val rowsInserted = preparedStatement.executeUpdate()
    if (rowsInserted > 0) {
      logger.info(s"New product: $product")
    }
  }
}
