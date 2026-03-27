"""
redis_service.py — Redis connection manager.

Provides a single shared async Redis client used throughout the app.
Used for:
  - Storing live focus scores: SET session:live:{student_id}
  - Publishing to class channels: PUBLISH pubsub:class:{class_id}
  - Subscribing to class channels (teacher WebSocket): SUBSCRIBE pubsub:class:{class_id}

Why a singleton?
  Creating a new Redis connection per request is expensive (TCP handshake, auth).
  Instead, we create one client at startup, keep it alive, and share it.
  This is the same pattern used for the SQLAlchemy engine.
"""
import redis.asyncio as aioredis
from app.config import settings

# Global Redis client — initialized on startup, reused across all requests.
# The type hint tells other files what to expect when they call get_redis().
redis_client: aioredis.Redis | None = None


async def init_redis() -> None:
    """
    Call this at FastAPI startup to initialize the Redis connection.

    from_url() creates an async connection pool behind the scenes.
    decode_responses=True means Redis returns Python strings instead of bytes.
    encoding="utf-8" sets the character encoding for those strings.
    """
    global redis_client
    redis_client = aioredis.from_url(
        settings.REDIS_URL,
        encoding="utf-8",
        decode_responses=True,
    )


async def get_redis() -> aioredis.Redis:
    """
    FastAPI dependency — returns the shared Redis client.

    Usage in a router:
        @router.post("/example")
        async def example(redis = Depends(get_redis)):
            await redis.set("key", "value")

    Or called directly in WebSocket endpoints (WebSockets don't use Depends):
        redis = await get_redis()
    """
    if redis_client is None:
        raise RuntimeError("Redis not initialized. Call init_redis() at startup.")
    return redis_client


async def close_redis() -> None:
    """
    Call this at FastAPI shutdown to cleanly close the connection pool.
    aclose() waits for in-flight commands to finish before closing.
    """
    global redis_client
    if redis_client:
        await redis_client.aclose()
        redis_client = None
