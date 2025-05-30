import logging
import os
import typing
import psycopg2
from mcp.server.fastmcp import FastMCP

# Create an MCP server
mcp = FastMCP("northwind")

DB_HOST = os.environ.get("DB_HOST", "127.0.0.1:55432")
DB_USER = os.environ.get("DB_USER", "postgres")
DB_PASSWORD = os.environ.get("DB_USER", "postgres")
DB_DATABASE = os.environ.get("DB_USER", "northwind")


@mcp.tool()
def query_data(sql: str) -> dict[str, typing.Any]:
    """Execute SQL queries safely"""
    logging.info(f"Executing SQL query: {sql}")
    conn = psycopg2.connect(
        f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_DATABASE}"
    )
    try:
        cursor = conn.cursor()
        cursor.execute(sql)
        return {"result": cursor.fetchall()}
    except Exception as e:
        return {"error": str(e)}
    finally:
        conn.close()


@mcp.prompt()
def example_prompt(code: str) -> str:
    return f"Please review this code:\n\n{code}"


if __name__ == "__main__":
    print("Starting server...")
    # Initialize and run the server
    mcp.run(transport="stdio")
