from pathlib import Path
from werkzeug.datastructures import FileStorage
from typing import List, Union

ALLOWED_IMAGE_EXTENSIONS = {'.png', '.jpg', '.jpeg', '.webp', '.gif'}

def _validate_and_get_suffix(filename: str) -> str:
    if not filename:
        raise ValueError("O arquivo enviado não possui um nome válido.")
        
    suffix = Path(filename).suffix.lower()
    
    if suffix not in ALLOWED_IMAGE_EXTENSIONS:
        raise ValueError(
            f"Extensão '{suffix}' não é permitida. "
            f"Envie apenas imagens ({', '.join(ext.replace('.', '') for ext in ALLOWED_IMAGE_EXTENSIONS)})."
        )
        
    return suffix

def save_image(file: FileStorage, filename_base: str, subfolders: List[Union[str, int]]) -> str:

    if not file or not file.filename:
        return None

    suffix = _validate_and_get_suffix(file.filename)
    
    filename = f"{filename_base}{suffix}"
    
    upload_dir = Path("app/static/uploads")
    for folder in subfolders:
        upload_dir = upload_dir / str(folder)
        
    upload_dir.mkdir(parents=True, exist_ok=True)
    file.save(str(upload_dir / filename))

    relative_path_parts = ["uploads"] + [str(f) for f in subfolders] + [filename]
    return "/".join(relative_path_parts)