import React, { useState } from 'react';
import { Building2, Plus, Copy, Check, Trash2, Search, Hash, ChevronDown, ChevronUp, Users } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';

// Helper to generate a school code like "DPS-AGR"
function generateCode(schoolName) {
  const words = schoolName.trim().split(/\s+/).filter(Boolean);
  let prefix = '';
  if (words.length === 1) {
    prefix = words[0].substring(0, 3).toUpperCase();
  } else if (words.length === 2) {
    prefix = (words[0].substring(0, 2) + words[1].substring(0, 1)).toUpperCase();
  } else {
    prefix = words.map(w => w[0]).join('').substring(0, 4).toUpperCase();
  }
  const suffix = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${suffix}`;
}

const initialSchools = [
  {
    id: 1,
    name: 'Delhi Public School, Agra',
    code: 'DPS-AGR',
    createdAt: '2026-03-20',
    teachers: 12,
    status: 'active',
  },
  {
    id: 2,
    name: 'Ryan International School',
    code: 'RIS-0X7',
    createdAt: '2026-04-01',
    teachers: 8,
    status: 'active',
  },
  {
    id: 3,
    name: 'Kendriya Vidyalaya, Lucknow',
    code: 'KVL-M3P',
    createdAt: '2026-04-10',
    teachers: 5,
    status: 'active',
  },
];

export default function SchoolCodes() {
  const [schools, setSchools] = useState(initialSchools);
  const [showModal, setShowModal] = useState(false);
  const [schoolName, setSchoolName] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSchoolId, setExpandedSchoolId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleGenerateCode = () => {
    if (!schoolName.trim()) return;
    setGeneratedCode(generateCode(schoolName));
  };

  const handleCreateSchool = () => {
    if (!schoolName.trim() || !generatedCode) return;
    const newSchool = {
      id: Date.now(),
      name: schoolName.trim(),
      code: generatedCode,
      createdAt: new Date().toISOString().split('T')[0],
      teachers: 0,
      status: 'active',
    };
    setSchools(prev => [newSchool, ...prev]);
    setSchoolName('');
    setGeneratedCode('');
    setShowModal(false);
  };

  const handleCopy = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id) => {
    setSchools(prev => prev.filter(s => s.id !== id));
    setDeleteConfirm(null);
  };

  const filteredSchools = schools.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ marginBottom: '8px' }}>School Codes</h1>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
            Generate & manage unique school codes for teacher authentication.
          </p>
        </div>
        <Button variant="orange" onClick={() => setShowModal(true)} style={{ gap: '8px' }}>
          <Plus size={18} />
          Generate New Code
        </Button>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '28px' }}>
        <Card hover style={{ borderTop: '4px solid var(--accent-orange)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ background: 'rgba(245, 158, 11, 0.15)', padding: '10px', borderRadius: '12px' }}>
              <Building2 size={22} color="var(--accent-orange)" />
            </div>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0, fontWeight: '600' }}>Total Schools</p>
              <h2 style={{ fontSize: '28px', margin: 0 }}>{schools.length}</h2>
            </div>
          </div>
        </Card>

        <Card hover style={{ borderTop: '4px solid var(--accent-purple)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ background: 'rgba(139, 92, 246, 0.15)', padding: '10px', borderRadius: '12px' }}>
              <Hash size={22} color="var(--accent-purple)" />
            </div>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0, fontWeight: '600' }}>Active Codes</p>
              <h2 style={{ fontSize: '28px', margin: 0 }}>{schools.filter(s => s.status === 'active').length}</h2>
            </div>
          </div>
        </Card>

        <Card hover style={{ borderTop: '4px solid var(--accent-green)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '10px', borderRadius: '12px' }}>
              <Users size={22} color="var(--accent-green)" />
            </div>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0, fontWeight: '600' }}>Total Teachers</p>
              <h2 style={{ fontSize: '28px', margin: 0 }}>{schools.reduce((acc, s) => acc + s.teachers, 0)}</h2>
            </div>
          </div>
        </Card>
      </div>

      {/* Search Bar */}
      <div style={{ position: 'relative', marginBottom: '24px' }}>
        <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
        <input
          type="text"
          placeholder="Search by school name or code..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            height: '48px',
            paddingLeft: '46px',
            paddingRight: '16px',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            color: 'var(--text-primary)',
            fontSize: '14px',
            outline: 'none',
            fontFamily: 'inherit',
            transition: 'border-color 150ms ease',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--accent-orange)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />
      </div>

      {/* School Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredSchools.length === 0 && (
          <Card>
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              <Building2 size={48} style={{ margin: '0 auto 16px', opacity: 0.4 }} />
              <p style={{ fontSize: '16px', margin: 0 }}>No schools found. Generate your first school code!</p>
            </div>
          </Card>
        )}

        {filteredSchools.map(school => (
          <Card key={school.id} hover style={{ overflow: 'hidden', transition: 'all 200ms ease' }}>
            <div
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
              onClick={() => setExpandedSchoolId(expandedSchoolId === school.id ? null : school.id)}
            >
              {/* Left: School Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(139,92,246,0.2))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Building2 size={24} color="var(--accent-orange)" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--text-primary)' }}>{school.name}</h3>
                  <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
                    Created: {school.createdAt} · {school.teachers} teacher{school.teachers !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {/* Right: Code + Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* Code Badge */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: 'var(--bg-tertiary)', padding: '8px 16px',
                  borderRadius: '8px', border: '1px solid var(--border)',
                }}>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '15px', fontWeight: '600',
                    color: 'var(--accent-orange)', letterSpacing: '0.08em',
                  }}>
                    {school.code}
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleCopy(school.code, school.id); }}
                    title="Copy code"
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      borderRadius: '6px', transition: 'background 150ms ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >
                    {copiedId === school.id ? <Check size={16} color="var(--accent-green)" /> : <Copy size={16} color="var(--text-muted)" />}
                  </button>
                </div>

                {/* Status */}
                <span style={{
                  fontSize: '12px', fontWeight: '600', padding: '4px 10px',
                  borderRadius: '999px',
                  background: school.status === 'active' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                  color: school.status === 'active' ? 'var(--accent-green)' : 'var(--accent-red)',
                  textTransform: 'uppercase', letterSpacing: '0.04em',
                }}>
                  {school.status}
                </span>

                {/* Expand Arrow */}
                {expandedSchoolId === school.id
                  ? <ChevronUp size={20} color="var(--text-muted)" />
                  : <ChevronDown size={20} color="var(--text-muted)" />}
              </div>
            </div>

            {/* Expanded Details */}
            {expandedSchoolId === school.id && (
              <div style={{
                marginTop: '20px', paddingTop: '20px',
                borderTop: '1px solid var(--border)',
                animation: 'fadeIn 200ms ease-out forwards',
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
                  <div style={{ background: 'var(--bg-tertiary)', padding: '16px', borderRadius: '12px' }}>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 4px', textTransform: 'uppercase', fontWeight: '600' }}>School Code</p>
                    <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '18px', color: 'var(--accent-orange)', margin: 0, fontWeight: '700' }}>{school.code}</p>
                  </div>
                  <div style={{ background: 'var(--bg-tertiary)', padding: '16px', borderRadius: '12px' }}>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 4px', textTransform: 'uppercase', fontWeight: '600' }}>Registered Teachers</p>
                    <p style={{ fontSize: '18px', color: 'var(--text-primary)', margin: 0, fontWeight: '700' }}>{school.teachers}</p>
                  </div>
                  <div style={{ background: 'var(--bg-tertiary)', padding: '16px', borderRadius: '12px' }}>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 4px', textTransform: 'uppercase', fontWeight: '600' }}>Created On</p>
                    <p style={{ fontSize: '18px', color: 'var(--text-primary)', margin: 0, fontWeight: '700' }}>{school.createdAt}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <Button variant="secondary" onClick={(e) => { e.stopPropagation(); handleCopy(school.code, school.id); }} style={{ height: '40px', fontSize: '13px', gap: '6px' }}>
                    {copiedId === school.id ? <Check size={14} /> : <Copy size={14} />}
                    {copiedId === school.id ? 'Copied!' : 'Copy Code'}
                  </Button>
                  {deleteConfirm === school.id ? (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Button variant="danger" onClick={(e) => { e.stopPropagation(); handleDelete(school.id); }} style={{ height: '40px', fontSize: '13px' }}>
                        Confirm Delete
                      </Button>
                      <Button variant="secondary" onClick={(e) => { e.stopPropagation(); setDeleteConfirm(null); }} style={{ height: '40px', fontSize: '13px' }}>
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button variant="danger" onClick={(e) => { e.stopPropagation(); setDeleteConfirm(school.id); }} style={{ height: '40px', fontSize: '13px', gap: '6px' }}>
                      <Trash2 size={14} />
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* ───── Generate Code Modal ───── */}
      {showModal && (
        <div
          onClick={() => { setShowModal(false); setSchoolName(''); setGeneratedCode(''); }}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'fadeIn 150ms ease-out forwards',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: '480px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              borderRadius: '20px',
              padding: '32px',
              boxShadow: 'var(--shadow-lg)',
              animation: 'fadeIn 200ms ease-out forwards',
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{
                background: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(139,92,246,0.25))',
                padding: '12px', borderRadius: '14px',
              }}>
                <Building2 size={26} color="var(--accent-orange)" />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '22px' }}>Generate School Code</h2>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
                  Create a unique code for teacher login
                </p>
              </div>
            </div>

            {/* School Name Input */}
            <Input
              label="School Name"
              placeholder="e.g. Delhi Public School, Agra"
              value={schoolName}
              onChange={e => { setSchoolName(e.target.value); setGeneratedCode(''); }}
            />

            {/* Generate Button */}
            <Button
              variant="purple"
              onClick={handleGenerateCode}
              style={{ width: '100%', marginBottom: '20px' }}
              disabled={!schoolName.trim()}
            >
              <Hash size={18} style={{ marginRight: '8px' }} />
              Generate Code
            </Button>

            {/* Generated Code Display */}
            {generatedCode && (
              <div style={{
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border)',
                borderRadius: '14px',
                padding: '20px',
                marginBottom: '24px',
                textAlign: 'center',
                animation: 'fadeIn 200ms ease-out forwards',
              }}>
                <p style={{ margin: '0 0 8px', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.06em' }}>
                  Generated School Code
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '32px', fontWeight: '700',
                    color: 'var(--accent-orange)',
                    letterSpacing: '0.1em',
                  }}>
                    {generatedCode}
                  </span>
                  <button
                    onClick={() => handleCopy(generatedCode, 'modal')}
                    style={{
                      background: 'rgba(255,255,255,0.08)', border: 'none', cursor: 'pointer',
                      padding: '8px', borderRadius: '8px', display: 'flex',
                      transition: 'background 150ms ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                  >
                    {copiedId === 'modal' ? <Check size={20} color="var(--accent-green)" /> : <Copy size={20} color="var(--text-muted)" />}
                  </button>
                </div>
                <p style={{ margin: '12px 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  School: <strong>{schoolName}</strong>
                </p>
              </div>
            )}

            {/* Modal Actions */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button
                variant="secondary"
                onClick={() => { setShowModal(false); setSchoolName(''); setGeneratedCode(''); }}
                style={{ flex: 1 }}
              >
                Cancel
              </Button>
              <Button
                variant="orange"
                onClick={handleCreateSchool}
                style={{ flex: 1, gap: '8px' }}
                disabled={!generatedCode}
              >
                <Plus size={16} />
                Add School
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
