"""
ingest_kb.py — Ingest knowledge base PDFs into FAISS vector store.

Reads all PDFs from kb/ subfolders (adhd/, pedagogy/, parenting/, intervention/),
splits them into chunks (512 tokens, 50 token overlap), embeds with
OllamaEmbeddings (nomic-embed-text) or HuggingFaceEmbeddings as fallback,
and saves the FAISS index to faiss_index/.

Output: faiss_index/ directory with index.faiss and index.pkl

TODO Day 5: Implement PDF loading, chunking, embedding, and FAISS index creation.
"""


def ingest():
    """Load PDFs, chunk, embed, and save FAISS index. TODO Day 5."""
    # TODO Day 5: implement with LangChain document loaders + FAISS
    print("ingest_kb.py — not yet implemented (Day 5)")


if __name__ == "__main__":
    ingest()
